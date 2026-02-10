import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { Header } from "./components/Header/Header";
import { Providers } from './redux/provider';
import { Footer } from './components/Footer/Footer';
import { App } from './App'


export const metadata = {
  title: "Solar Future",
  description: "Автоматизация инфраструктуры для солнечной энергетики просто",
  keywords: "Solar Future",
  author: "Denis Amirov",
  icons: [
    {
      rel: 'icon',
      sizes: '128x128',
      url: './sun.png',
    }]
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <div className='box'>
          <Providers>
            <Header />
            <App >
              {children}
            </App>
            <div className='footer'>
              <Footer />
            </div>
          </Providers>
        </div>
      </body>
    </html>
  );
}
