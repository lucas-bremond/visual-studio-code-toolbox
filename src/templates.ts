//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// @project        Visual Studio Code Toolbox
/// @file           src/templates.ts
/// @author         Lucas Brémond <lucas.bremond@gmail.com>
/// @license        MIT

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const hashHeaderTemplate: string = `
######################################################################################################################################################

# @project        $PROJECT_NAME
# @file           $FILE_PATH
# @author         $AUTHOR_NAME <$AUTHOR_EMAIL>
# @license        Copyright © $COPYRIGHT_START_YEAR-$COPYRIGHT_END_YEAR $COPYRIGHT_COMPANY

######################################################################################################################################################

`.substring(1) ;

const hashFooterTemplate: string = `


######################################################################################################################################################
`.substring(1) ;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const slashHeaderTemplate: string = `
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// @project        $PROJECT_NAME
/// @file           $FILE_PATH
/// @author         $AUTHOR_NAME <$AUTHOR_EMAIL>
/// @license        Copyright © $COPYRIGHT_START_YEAR-$COPYRIGHT_END_YEAR $COPYRIGHT_COMPANY

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

`.substring(1) ;

const slashFooterTemplate: string = `


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
`.substring(1) ;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const templateMap: Map<string, [string, string]> = new Map<string, [string, string]>
(
    [
        ['# ', [hashHeaderTemplate, hashFooterTemplate]],
        ['/* ', [slashHeaderTemplate, slashFooterTemplate]]
    ]
) ;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
