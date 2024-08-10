import React from 'react'

export default function HorizontalDividerWithText({ content }) {
    return (
        <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">{content}</span>
            <div className="flex-grow border-t border-gray-400"></div>
        </div>
    )
}
