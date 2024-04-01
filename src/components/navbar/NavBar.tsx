import { Link } from "react-router-dom"

export const NavBar = () => {
    return(
        <header className="flex fixed bg-red-600 text-white items-center justify-between px-8 w-full h-[60px]">
            <a href="">Big Easy PDF</a>
            <nav>
                <ul className="flex gap-4">
                    <Link to="">
                        <li>Home</li>
                    </Link>
                    <Link to="MergePDF">
                        <li>PDF Tools</li>
                    </Link>
                    <Link to="">
                        <li>Sobre</li>
                    </Link>
                </ul>
            </nav>
        </header>
    )
}