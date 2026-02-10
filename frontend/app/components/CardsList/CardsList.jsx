import { MyCard } from "../MyCard/MyCard"
import Styles from './CardsList.module.css'

export const CardsList = (props) => {
    return (
        <div className={Styles["CardsList"]}>
            {props.data && props.data.map((item) => {
                return (
                    <MyCard key={item._id} data={item} params={props.params} />
                )
            })}
        </div>
    )
}
