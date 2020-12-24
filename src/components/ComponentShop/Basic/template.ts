// import Carousel from './Carousel/template';
import Text from './Text/template';
import Image from './Image/template';
import Footer from './Footer/template';
const basicTmp = [
    // Carousel,
    Text,
    // Image,
    // Footer
]
const BasicTemplate = basicTmp.map(v => {
    return {...v, category: 'base'};
})

export default BasicTemplate;