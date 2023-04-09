import { Outlet, Link, useParams } from "react-router-dom";
import "../styles/header.css"


interface HeaderLinkProps {
  page: string;
  title: string
  selected: boolean;
}

const HeaderLink = ({ page, title, selected }: HeaderLinkProps) => {
  let className = selected ? 'headerlink-no-link ' : '';
  className += 'headerlink-title';

  return (
    <Link to={`/${page}`} className={className}>
      {title + " /"}
      <div className={selected ? 'headerlink-dot-active' : 'headerlink-dot'}>
        •
      </div>
    </Link>
  );
};

const Header = () => {
  const { page } = useParams<{ page?: string }>() || { page: 'home' };
  console.log("Test", page)
  

  return (
    <div className='header'>
    <HeaderLink page = "MatrixCalculator" title='Matrix Calculator' selected={page === 'MatrixCalculator'} />
    <HeaderLink page = "ExternalityCalculator" title='Externality Calculator' selected={page === 'ExternalityCalculator'} />
    <HeaderLink page = "LemonsAndOranges" title='Lemons And Oranges' selected={page === 'LemonsAndOranges'} />
    <HeaderLink page = "DecreasingSurplus" title='Decreasing Surplus' selected={page === 'DecreasingSurplus'} />
    <HeaderLink page = "Rubinstein" title='Rubinstein' selected={page === 'Rubinstein'} />
    <HeaderLink page = "SeparatingPooling" title='Separating and Pooling' selected={page === 'SeparatingPooling'} />
    <HeaderLink page = "about" title='About' selected={page === 'about'} />
    </div>
    );
};

export default Header;
