import { Link, useLocation } from "react-router-dom";
import "../styles/header.css"


interface HeaderLinkProps {
  page: string;
  title: string
  selected: boolean;
  position: "first" | "middle" | "last";
}



const HeaderLink = ({ page, title, selected, position}: HeaderLinkProps) => {
  let className = selected ? 'headerlink-no-link ' : '';
  className += 'headerlink-title';

  // Set title here. First link will have space after, middle links will have space before and after, last link will have space before
  // This is to make the dots line up
  // \u00A0 is a non-breaking space
  let titleDisplay = title;
  if (position === "first"){
    titleDisplay += '\u00A0 |';
  } else if (position === "last"){
    titleDisplay = '\u00A0 ' + titleDisplay;
  } else {
    titleDisplay = '\u00A0 ' + titleDisplay + '\u00A0 |';
  }

  return (
    <Link to={`/${page}`} className={className}>
      {titleDisplay}
      <div className={selected ? 'headerlink-dot-active' : 'headerlink-dot'}>
        •
      </div>
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
          position={
            index === 0
              ? "first"
              : index === links.length - 1
              ? "last"
              : "middle"
          }
        />
      ))}
    </div>
  );
};


export default Header;
