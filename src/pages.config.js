import Home from './pages/Home';
import Chess from './pages/Chess';
import VRChess from './pages/VRChess';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Chess": Chess,
    "VRChess": VRChess,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};