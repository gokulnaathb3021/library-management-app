import Signout from "./Signout";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <h1>Your Library</h1>
      <Signout />
    </div>
  );
};

export default Header;
