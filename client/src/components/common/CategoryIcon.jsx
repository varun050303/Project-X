// src/components/CategoryIcon.js
import React from "react";
import { MdElectricBolt } from "react-icons/md";
import { MdOutlinePlumbing } from "react-icons/md";
import { MdOutlineCarpenter } from "react-icons/md";
import { FaClipboardList, FaPaintRoller } from "react-icons/fa6";
// Sample mapping of categories to icons
const categoryIcons = {
  Plumbing: <MdOutlinePlumbing color="teal" size={40} />,
  Electrical: <MdElectricBolt color="yellow" size={40} />,
  Carpentry: <MdOutlineCarpenter color="gray" size={40} />,
  Painting: <FaPaintRoller color="yellow" size={40} />,
};

export default function CategoryIcon({ category }) {
  return categoryIcons[category] || <FaClipboardList size={24} />;
}
