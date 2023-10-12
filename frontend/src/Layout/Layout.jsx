import Nav from "./Nav";

const Layout = (props) => {
  return (
    <div className=''>
      <Nav />
      <main className=''>{props.children}</main>
    </div>
  );
};
export default Layout;
