import React from "react";

interface WidgetProps {
	title: string;
	accentColor: string;
	content: React.ReactNode;
}

export const Widget: React.FC<WidgetProps> = ({
	title,
	accentColor,
	content,
}) => {
	return (
		<div className="bg-card backdrop-blur-lg rounded-2xl p-7 border border-white/5 transition-colors hover:border-white/10">
			<div className={`border-t-2 border-${accentColor} pt-4`}>
				<h3 className="text-lg font-medium tracking-wide mb-5">{title}</h3>
				<div>{content}</div>
			</div>
		</div>
	);
};
