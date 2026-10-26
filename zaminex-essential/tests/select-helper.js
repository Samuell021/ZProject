/** Exercise the same selection path available to the user (calendar or custom select). */
export async function selectOption(locator, value) {
  if ((await locator.evaluate(el => el.tagName)) === 'SELECT') return locator.selectOption(value);
  await locator.click();
  const id = await locator.getAttribute('aria-controls');
  const panel = locator.page().locator(`[id=${JSON.stringify(id)}]`);
  const requested = typeof value === 'object' ? value.value ?? value.label : value;
  if (typeof value === 'object' && value.label !== undefined) await panel.getByRole('option', {
    name: value.label,
    exact: true
  }).click();else await panel.locator(`[role="option"][data-value=${JSON.stringify(String(requested))}]`).click();
}
