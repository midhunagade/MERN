import React from "react";
import "./UsersList.css";
import UserItem from "./UserItem";

const UsersList = (props) => {
  return props?.items?.length === 0 ? (
    <div className="center">
      <h2>No Users Found</h2>
    </div>
  ) : (
    <ul className="users-list">
      {props?.items?.map((user) => (
        <UserItem
          key={user?.id}
          id={user?.id}
          image={user?.image}
          name={user?.name}
          placeCount={user?.places?.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
