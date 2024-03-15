import Signout from "./Signout";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <h2>Your Library</h2>
      <Signout />
    </div>
  );
};

export default Header;
