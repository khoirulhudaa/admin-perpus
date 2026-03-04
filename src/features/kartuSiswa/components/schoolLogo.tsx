// Assuming your SchoolLogo component looks something like this
interface SchoolLogoProps {
  title: string
  image: string
  style?: React.CSSProperties // Allow optional style prop
}

const SchoolLogo: React.FC<SchoolLogoProps> = ({ title, image, style }) => (
  <div>
    <img
      src={image}
      alt={title}
      style={style} // Apply the style prop here
    />
  </div>
)

export default SchoolLogo
