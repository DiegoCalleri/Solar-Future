'use client';
import Styles from "./Overlay.module.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closePopup } from "../../redux/features/counter/counterSlice";

export const Overlay = () => {

  const popupIsOpened = useSelector((state) => state.counter.popupIsOpened)
  const dispatch = useDispatch()

  return (
    <div
      className={`${Styles["overlay"]} ${
        popupIsOpened && Styles["overlay_is-opened"]
      }`}
      onClick={() => dispatch(closePopup()) }
    ></div>
  );
};