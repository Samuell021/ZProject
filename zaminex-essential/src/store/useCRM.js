import {syncPropertyListings} from "../services/property-listings";
import { create } from "zustand";
import { createSeed, schemaVersion, updateDemoStaff } from "../mock/seed";
import { operate } from "../services/operations";
import { syncLeadAcceptanceTasks } from "../services/intake";
const KEY = "farda-crm-sample";
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const x = JSON.parse(raw);
      const seed = createSeed();
      // The old sample had contradictory stories. Preserve it before adopting the new demo.
      if ([1,2].includes(x?.schemaVersion) && schemaVersion === 3 && x.db) {
        localStorage.setItem(`${KEY}-backup-v${x.schemaVersion}-${Date.now()}`, raw);
        const fresh = {schemaVersion, db: syncPropertyListings(syncLeadAcceptanceTasks(seed)), actorId: seed.users.some(u=>u.id===x.actorId&&u.is_active)?x.actorId:"u1"};
        localStorage.setItem(KEY, JSON.stringify(fresh));
        return {db:fresh.db, actorId:fresh.actorId, storageError:""};
      }

      if (
        x?.schemaVersion === schemaVersion &&
        Object.keys(seed).every((k) => Array.isArray(x.db?.[k]))
      )
        return {
          db: syncPropertyListings(syncLeadAcceptanceTasks(updateDemoStaff(x.db))),
          actorId: x.db.users.some((u) => u.id === x.actorId && u.is_active)
            ? x.actorId
            : "u1",
          storageError: "",
        };
      return {
        db: syncPropertyListings(syncLeadAcceptanceTasks(seed)),
        actorId: "u1",
        storageError:
          "نسخه یا ساختار داده ذخیره‌شده سازگار نیست؛ داده قبلی حفظ شده و نمونه موقت باز شده است.",
      };
    }
  } catch {
    return {
      db: syncPropertyListings(syncLeadAcceptanceTasks(createSeed())),
      actorId: "u1",
      storageError:
        "داده ذخیره‌شده قابل خواندن نیست؛ تا بازنشانی، نمونه موقت است و داده قبلی بازنویسی نمی‌شود.",
    };
  }
  return { db: syncPropertyListings(syncLeadAcceptanceTasks(createSeed())), actorId: "u1", storageError: "" };
}
export const useCRM = create((set, get) => ({
  ...load(),
  storageWarning: "",
  busy: false,
  message: "",
  error: "",
  failNext: false,
  setActor: (actorId) => {
    set({ actorId });
    get().persist();
  },
  persist: () => {
    try {
      const { db, actorId, storageError } = get();
      if (!storageError) {
        localStorage.setItem(
          KEY,
          JSON.stringify({ schemaVersion, db, actorId }),
        );
        set({ storageWarning: "" });
      }
    } catch {
      set({
        storageWarning:
          "ذخیره در مرورگر انجام نشد؛ تغییرات فعلی با تازه‌کردن یا بستن صفحه از دست می‌روند. دسترسی یا فضای ذخیره مرورگر را بررسی کنید.",
      });
    }
  },
  reset: () => {
    set({
      db: syncPropertyListings(syncLeadAcceptanceTasks(createSeed())),
      storageError: "",
      error: "",
      message: "داده نمایشی بازنشانی شد.",
    });
    get().persist();
  },
  run: async (action, payload = {}) => {
    if (get().busy) return null;
    const actingUser = get().actorId;
    set({ busy: true, error: "", message: "" });
    try {
      await new Promise((r) => setTimeout(r, 250));
      if (get().failNext) {
        set({ failNext: false });
        throw Error(
          "شکست نمایشی عملیات؛ هیچ تغییری ذخیره نشد. دوباره تلاش کنید.",
        );
      }
      const db = operate(get().db, actingUser, action, {
        ...payload,
        operation_id: payload.operation_id || crypto.randomUUID(),
      });
      set({ db, message: db._warning || "عملیات با موفقیت ثبت شد." });
      get().persist();
      return db._result || true;
    } catch (e) {
      set({ error: e.message });
      return null;
    } finally {
      set({ busy: false });
    }
  },
}));
