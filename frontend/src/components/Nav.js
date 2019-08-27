import Link from "next/link";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import Signout from "./Signout";

const Nav = () => (
  <User>
    {({ data }) => {
      const me = data ? data.me : null;
      return (
        <NavStyles data-test="nav">
          <Link href="/">
            <a>Info</a>
          </Link>
          {me && (
            <>
              <Link href="/view">
                <a>View Members</a>
              </Link>
              <Link href="/create">
                <a>Add New Member</a>
              </Link>
              <Signout />
            </>
          )}
          {!me && (
            <Link href="/signin">
              <a>Sign In</a>
            </Link>
          )}
        </NavStyles>
      );
    }}
  </User>
);

export default Nav;
