import React from "react";
import PropTypes from "prop-types";

const SubTitle = ({ text, className = "" }) => {
  return (
    <h3 className={`text-black text-base font-semibold ${className}`}>
      {text}
    </h3>
  );
};

SubTitle.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default SubTitle;
