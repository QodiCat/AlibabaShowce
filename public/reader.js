// Desktop spreads always begin on odd-numbered content pages; page zero is the cover.
export function normalizePage(value, total, mobile) {
  const page = Math.max(0, Math.min(total, Math.trunc(value) || 0));
  return mobile || page === 0 ? page : 1 + Math.floor((page - 1) / 2) * 2;
}

export function adjacentPage(page, direction, total, mobile) {
  if (direction > 0 && page === 0) return total ? 1 : 0;
  if (direction > 0 && isLastPage(page, total, mobile)) return page;
  return normalizePage(page + direction * (mobile ? 1 : 2), total, mobile);
}

export function isLastPage(page, total, mobile) {
  return page + (mobile || page === 0 ? 0 : 1) >= total;
}

export function swipeDirection(dx, dy, width) {
  return Math.abs(dx) >= Math.max(40, Math.min(80, width * .14)) && Math.abs(dx) > Math.abs(dy) * 1.3
    ? (dx < 0 ? 1 : -1) : 0;
}

export function turnFrames(direction) {
  return [
    {transform:'rotateY(0deg)', opacity:1},
    {transform:`rotateY(${direction > 0 ? -85 : 85}deg)`, opacity:1, offset:.52},
    {transform:`rotateY(${direction > 0 ? -170 : 170}deg)`, opacity:0},
  ];
}
