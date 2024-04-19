import Link from "next/link";

export default function Header({ currentUser }) {
  const anchorLinks = [
    !currentUser && { label: "sign up", href: "/auth/signup" },
    !currentUser && { label: "sign in", href: "/auth/signin" },
    currentUser && { label: "sign out", href: "/auth/signout" },
  ]
    .filter((eachLinkConfiguration) => eachLinkConfiguration) // only keep indices that are not falsy
    .map(({ label, href }) => {
      return (
        <li key={href}>
          <Link href={href} className='nav-link'>
            {label}
          </Link>
        </li>
      );
    });

  return (
    <>
      <nav className='navbar navbar-light bg-light' style={{ margin: "10px" }}>
        <Link className='navbar-brand' href='/'>
          Tickets
        </Link>

        <div className='d-flex justify-content-end'>
          <ul className='nav d-flex align-items-center'>{anchorLinks}</ul>
        </div>
      </nav>
    </>
  );
}
