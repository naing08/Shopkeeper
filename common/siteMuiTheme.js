/**
 * Created by ChitSwe on 2/25/17.
 */
/**
 * Created by ChitSwe on 2/25/17.
 */
/**
 * Created by ChitSwe on 1/5/17.
 */
import {
    red500, red700,
    orangeA200,
    grey100, grey300, grey400, grey500,
    white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
const muiTheme = {
    palette: {
        primary1Color: red500,
        primary2Color: red700,
        primary3Color: grey400,
        accent1Color: orangeA200,
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: red500,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
    }
};
export default muiTheme;