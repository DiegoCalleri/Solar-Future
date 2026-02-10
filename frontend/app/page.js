import { Cover } from './components/Cover/Cover'
import { ContentBlock } from './components/ContentBlock/ContentBlock'
import { FormOrder } from './components/FormOrder/FormOrder';
import Styles from './page.module.css'



export default function Home() {
  return (
    <main className={Styles["main__container"]}>
      <Cover
        imgPath={'/images/main.webp'}
        title={"Solar Future"}
        description={`Решения по автоматизации в сфере альтернативных источников энергии`}
        btnTitle={'Узнать больше'} />
      <ContentBlock />
      <Cover
        imgPath={'/images/schema.png'}
        title={"Главная схема"}
        description={`
          Доступ к главной электрической схеме проекта выдается администратором сайта`}
        btnTitle={'Получить доступ'} />
      <div className={Styles["main__form-container"]}>
        <a name="order"></a>
        <h1 className={Styles["main__form-container-title"]}>Задать вопрос</h1>
        <FormOrder />
      </div>
    </main>
  );
}
