import { forwardRef } from "react";
import { Tooltip } from "@mantine/core";
import { GoQuestion } from "react-icons/go";

const QuestionMarkTooltipIcon = forwardRef(
  ({ handleToolTip, opened, label, multiline, width }, ref) => (
    <Tooltip
      position="top"
      opened={opened}
      label={label}
      offset={20}
      multiline={multiline}
      w={width}
      withArrow
      arrowSize={8}
    >
      <div ref={ref}>
        <GoQuestion size={18} onClick={handleToolTip} />
      </div>
    </Tooltip>
  )
);

export default QuestionMarkTooltipIcon;
