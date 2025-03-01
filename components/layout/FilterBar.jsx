// components/layout/NavigationBar.js

import styles from '@/styles/components/FilterBar.module.css';

import Select from '../ui/Select';
//TODO make this a dataset
const SELECTDUMMIES = [
  {
    id: 1,
    name: 'league',
    label: 'League/Tournament',
    options: [{ value: 1, label: 'State League' }],
    placeholder: 'Please Select a League/Tournament',
  },
  {
    id: 2,
    name: 'division',
    label: 'Division',
    options: [{ value: 1, label: '13U Div II Girls' }],
    placeholder: 'Please Select a Division',
  },
  {
    id: 3,
    name: 'season',
    label: 'Season',
    options: [{ value: 1, label: '2025 Spring' }],
    placeholder: 'Please Select a Season',
  },
];
export default function FilterBar() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Select
            id={SELECTDUMMIES[0].id}
            label={SELECTDUMMIES[0].label}
            name={SELECTDUMMIES[0].name}
            options={SELECTDUMMIES[0].options}
            placeholder={SELECTDUMMIES[0].placeholder}
          />
        </li>
        <li>
          <Select
            id={SELECTDUMMIES[1].id}
            label={SELECTDUMMIES[1].label}
            name={SELECTDUMMIES[1].name}
            options={SELECTDUMMIES[1].options}
            placeholder={SELECTDUMMIES[1].placeholder}
          />
        </li>
        <li>
          <Select
            id={SELECTDUMMIES[2].id}
            label={SELECTDUMMIES[2].label}
            name={SELECTDUMMIES[2].name}
            options={SELECTDUMMIES[2].options}
            placeholder={SELECTDUMMIES[2].placeholder}
          />
        </li>
      </ul>
    </nav>
  );
}
