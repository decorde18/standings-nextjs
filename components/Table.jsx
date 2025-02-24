import styles from '@/styles/Table.module.css';

const Table = ({ data }) => {
  return (
    <div className={styles.container}>
      {/* Table Header */}
      <ul className={styles.tableHeader}>
        <li className={styles.colRank}>#</li>
        <li className={styles.colTeam}>Team</li>
        <li className={styles.colStat}>W</li>
        <li className={styles.colStat}>L</li>
        <li className={styles.colStat}>PTS</li>
      </ul>

      {/* Table Rows */}
      {data.map((team, index) => (
        <ul key={team.id} className={styles.tableRow}>
          <li className={styles.colRank}>{index + 1}</li>
          <li className={styles.colTeam}>{team.name}</li>
          <li className={styles.colStat}>{team.wins}</li>
          <li className={styles.colStat}>{team.losses}</li>
          <li className={styles.colStat}>{team.points}</li>
        </ul>
      ))}
    </div>
  );
};

export default Table;
