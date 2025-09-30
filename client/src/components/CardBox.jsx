import React from "react";

const CardBox = ({ icon, title, children, action, className }) => {
  return (
<div className={`card-box ${className || ""}`}>
  {title && (
    <div className="card-header">
      {icon && <span className="card-icon">{icon}</span>}
      <h3>{title}</h3>
      {action && <div className="card-action">{action}</div>}
    </div>
  )}
  <div className="card-body">{children}</div>
</div>

  );
};

export default CardBox;
