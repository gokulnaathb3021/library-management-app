import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./Pagination.module.css";

type propsType = {
  count: number;
};
const Pagination: React.FC<propsType> = ({ count }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams);
  const ITEM_PER_PAGE = 2;
  const page = parseInt(searchParams.get("page") as string) || 1;

  const hasPrev = page - 1 > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;

  function handleChangePage(_type: string) {
    _type === "prev"
      ? params.set("page", (page - 1).toString())
      : params.set("page", (page + 1).toString());
    replace(`${pathname}?${params}`);
  }
  return (
    <div className={styles.buttons}>
      <button disabled={!hasPrev} onClick={() => handleChangePage("prev")}>
        Previous
      </button>
      <button disabled={!hasNext} onClick={() => handleChangePage("next")}>
        Next
      </button>
    </div>
  );
};
export default Pagination;
