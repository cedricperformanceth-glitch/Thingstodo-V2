import { addToTrip } from './store';
document.addEventListener('click', (event) => { const button = (event.target as Element).closest<HTMLButtonElement>('[data-trip]'); if (!button) return; addToTrip(JSON.parse(button.dataset.entity ?? '{}')); button.textContent = 'Added to My Trip'; });
