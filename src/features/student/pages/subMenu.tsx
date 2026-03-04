import { NavLink } from "react-router-dom";
import { STUDENT_SUBMENU } from "../utils";
import { buttonVariants, cn } from "@/core/libs";

const SubMenuDetail = () => {
  return (
    <div className="py-4 mt-6">
        {STUDENT_SUBMENU.map((submenu, index) => {
          return (
            <NavLink
              key={index}
              to={submenu.path}
              end
              className={({ isActive }) => {
                return cn(
                  buttonVariants({ variant: isActive ? 'default' : 'outline' }),
                  'mr-2',
                );
              }}
            >
              {submenu.title}
            </NavLink>
          );
        })}
      </div>
  )
}

export default SubMenuDetail