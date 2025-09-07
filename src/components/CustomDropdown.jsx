// import React, { useState } from "react";
// import styles from "../styles/CustomDropdown.module.css";

// export default function CustomDropdown({ label, options, value, onChange }) {
//   const [open, setOpen] = useState(false);

//   const handleSelect = (val) => {
//     onChange(val);
//     setOpen(false);
//   };

//   return (
//     <div className={styles.dropdownContainer}>
//       <label>{label}</label>
//       <div
//         className={styles.dropdownSelected}
//         onClick={() => setOpen(!open)}
//       >
//         {value || `Select ${label}`}
//         <span className={styles.arrow}>{open ? "▲" : "▼"}</span>
//       </div>
//       {open && (
//         <div className={styles.dropdownOptions}>
//           {options.map((opt, idx) => (
//             <div
//               key={idx}
//               className={styles.dropdownOption}
//               onClick={() => handleSelect(opt.value)}
//             >
//               {opt.label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
