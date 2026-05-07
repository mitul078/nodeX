const COLORS = [
    "#ccd5ae",
    "#e9edc9",
    "#fdffb6",
    "#edede9",
    "#ffdab9",
    "#a9def9",
]

function getInitials(name) {
    if (!name) return

    return name
        .trim()
        .split(" ")
        .map(word => word[0].toUpperCase())
        .slice(0, 2)
        .join("")
}

function colorPicker(userId) {
    const i = userId.charCodeAt(0) % COLORS.length

    return COLORS[i]
}

function generateAvatar(name, userId) {
    const initials = getInitials(name)
    const bgColor = colorPicker(userId)

    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" fill="${bgColor}"/>
            <text
                x="50"
                y="50"
                text-anchor="middle"
                dominant-baseline="central"
                font-family="Arial, sans-serif"
                font-size="36"
                font-weight="bold"
                fill="#FFFFFF"
            >
                ${initials}
            </text>
        </svg>
    `.trim()
}

module.exports = {
    getInitials,
    generateAvatar,
    colorPicker
}