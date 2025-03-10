import Button from '@/components/ui/Button';
import * as table from '@/lib/tables';
import styles from '@/styles/components/Details.module.css';

function Details({ handleChange, data, label, columns }) {
  const displayFields = table[columns].filter(
    (field) => field.display !== false
  );

  return (
    <div className={styles.detailsContainer}>
      {displayFields.map((field) => (
        <div key={field.name} className={styles.fieldRow}>
          <div className={styles.fieldLabel}>{field.label}</div>
          <div className={styles.fieldValue}>{data[field.name]}</div>
        </div>
      ))}
      <div className={styles.editButtonContainer}>
        <Button name="edit" type="button" onClick={handleChange}>
          Update {label}
        </Button>
      </div>
    </div>
  );
}

export default Details;
