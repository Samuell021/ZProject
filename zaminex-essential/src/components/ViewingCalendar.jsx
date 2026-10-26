import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Badge, date, num, person, staff } from "./ui";
import {
  shiftDay,
  startOfWeek,
  tehranDay,
  weekDays,
} from "../services/calendar";
export default function ViewingCalendar({ viewings, db, onResult }) {
  const [q, setQ] = useSearchParams();
  const start = startOfWeek(q.get("week"));
  const days = weekDays(start);
  const today = tehranDay();
  const move = (value) => {
    const next = new URLSearchParams(q);
    next.set("week", value);
    next.set("view", "calendar");
    next.delete("action");
    next.delete("record");
    setQ(next);
  };
  const dayLabel = (value) =>
    new Date(value + "T12:00:00Z").toLocaleDateString("fa-IR", {
      timeZone: "Asia/Tehran",
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  const sorted = viewings
    .slice()
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  const count = sorted.filter((v) =>
    days.includes(tehranDay(v.scheduled_at)),
  ).length;
  return (
    <div className="viewing-calendar">
      <div className="section-head">
        <div>
          <h3>
            {dayLabel(start)} تا {dayLabel(days[6])}
          </h3>
          <small>{num(count)} بازدید در این هفته · ساعت تهران</small>
        </div>
        <div className="toolbar">
          <button
            className="secondary"
            onClick={() => move(shiftDay(start, -7))}
          >
            هفته قبل
          </button>
          <button
            className="secondary"
            onClick={() => move(startOfWeek(today))}
          >
            هفته جاری
          </button>
          <button
            className="secondary"
            onClick={() => move(shiftDay(start, 7))}
          >
            هفته بعد
          </button>
        </div>
      </div>
      <div className="week-calendar-grid">
        {days.map((day) => {
          const events = sorted.filter(
            (v) => tehranDay(v.scheduled_at) === day,
          );
          return (
            <section
              className={`calendar-day ${day === today ? "calendar-today" : ""}`}
              key={day}
              aria-label={dayLabel(day)}
            >
              <h3>
                {dayLabel(day)}
                {day === today && <span className="badge">امروز</span>}
              </h3>
              {events.length ? (
                events.map((v) => {
                  const intro = db.introductions.find(
                    (x) => x.id === v.introduction_id,
                  );
                  const inquiry = db.inquiries.find(
                    (x) => x.id === intro?.inquiry_id,
                  );
                  return (
                    <article className="viewing-calendar-event" key={v.id}>
                      <b>
                        {new Date(v.scheduled_at).toLocaleTimeString("fa-IR", {
                          timeZone: "Asia/Tehran",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </b>
                      <p>{person(db, inquiry?.contact_id)}</p>
                      <small>{staff(db, v.consultant_id)}</small>
                      <Badge value={v.status} />
                      <small>{v.outcome || "بازدید برنامه‌ریزی‌شده"}</small>
                      <Link to={`/introductions/${v.introduction_id}`}>
                        معرفی مرتبط ←
                      </Link>
                      {!["COMPLETED", "DONE", "CANCELLED"].includes(
                        v.status,
                      ) && (
                        <button
                          className="secondary"
                          onClick={() => onResult(v.id)}
                        >
                          ثبت نتیجه بازدید
                        </button>
                      )}
                    </article>
                  );
                })
              ) : (
                <p className="muted">بدون بازدید</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
