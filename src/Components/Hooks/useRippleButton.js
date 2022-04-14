export function useRippleButton(e) {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - (rect.left + 15);
  const y = e.clientY - rect.top;

  const rippleElement = document.createElement('span');
  rippleElement.classList.add('ripple-btn-el');
  rippleElement.style.left = `${x}px`;
  rippleElement.style.top = `${y}px`;

  e.target.appendChild(rippleElement);

  setTimeout(() => {
    rippleElement.remove();
  }, 1000);
}
