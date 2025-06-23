import React from "react";
import PropTypes from "prop-types";

const SectionTitle = ({ text, className = "" }) => {
  return (
    <h2
      className={`text-branddeepblue text-xl sm:text-2xl font-semibold mb-4 ${className}`}
    >
      {text}
    </h2>
  );
};

SectionTitle.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default SectionTitle;
