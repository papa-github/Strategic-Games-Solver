import { Link, useLocation } from "react-router-dom";
import "../styles/header.css"


interface HeaderLinkProps {
  page: string;
  title: string
  selected: boolean;
}



const HeaderLink = ({ page, title, selected}: HeaderLinkProps) => {
  let className = selected ? 'headerlink-no-link ' : '';
  className += 'headerlink-title';

  return (
    <Link to={`/${page}`} className={className}>
      {title}

    </Link>
  );
};

const Header = () => {

  //Get current page
  //This is used to determine which nav has a dot under it
  const currentLocation = useLocation().pathname;
  const page = currentLocation.substring(currentLocation.lastIndexOf('/') + 1);

  //Add new links here
  const links = [
    { page: "MatrixCalculator", title: "Matrix Calculator" },
    { page: "ExternalityCalculator", title: "Externality Calculator" },
    { page: "LemonsAndOranges", title: "Lemons And Oranges" },
    { page: "DecreasingSurplus", title: "Decreasing Surplus" },
    { page: "Rubinstein", title: "Rubinstein" },
    { page: "SeparatingPooling", title: "Separating and Pooling" },
    { page: "about", title: "About" },
  ];

  //Don't touch
  return (
    <div className="header">
      {links.map((link, index) => (
        <HeaderLink
          key={index}
          page={link.page}
          title={link.title}
          selected={page === link.page}
        />
      ))}
    </div>
  );
};


export default Header;
