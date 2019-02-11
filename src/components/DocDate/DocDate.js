import React from "react";
import { localize } from "../../localize";

const DocDate = ({ startDate, endDate, year, date, t }) => {
  if (date) {
    return <span>{date}</span>;
  } else if (year) {
    return <span>{t(year)}</span>;
  } else if (startDate && endDate) {
    return (
      <span>
        {startDate} - {startDate}
      </span>
    );
  } else {
    return <span>{t("unknown")}</span>;
  }
};

export default localize()(DocDate);
