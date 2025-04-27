import { Link } from "react-router-dom";
import styles from "../../CSS/NoFound/NoFound.module.scss"

function NoFound() {

    return (
        <div className={styles.center}>
            <div className={styles.grid}>
                <div className={styles.center}>
                    <div className={styles.start}>
                        {/* <Image src="/Asset 13.svg" className={styles.logoSize}></Image> */}
                        <div className={styles.bold}>404.</div>
                        <div className={styles.light}>That's an error.</div>
                        <br />
                        <div className={styles.bold}>The requested URL was not found  <br /> on this server.</div>
                        <br />
                        <div className={styles.light}>That's all we know.</div>
                        <br />
                        <Link to="/"><button className={styles.errorBtn}>Go home</button></Link>
                    </div>
                </div>
                <div className={styles.center}>
                    {/* <Image className={styles.robot} src="/404 (3).svg"  ></Image> */}
                </div>
            </div>
        </div>
    )
}
export default NoFound;