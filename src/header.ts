//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// @project        Visual Studio Code Toolbox
/// @file           src/header.ts
/// @author         Lucas Brémond <lucas.bremond@gmail.com>
/// @license        MIT

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import moment = require('moment') ;

import { languageDelimiters } from './delimiters' ;
import { templateMap } from './templates' ;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type HeaderInfo =
{

    projectName: string ;

    filePath: string ;

    authorName: string ;
    authorEmail: string ;

    copyrightStartYear: number ;
    copyrightEndYear: number ;
    copyrightCompany: string ;

} ;

const headerFieldRegexMap: Map<string, string | null> = new Map<string, string | null>
(
    [
        ['PROJECT_NAME', `^([\\s\\S]*@project *)(.*)`],
        ['FILE_PATH', `^([\\s\\S]*@file *)(.*)`],
        ['AUTHOR_NAME', `^([\\s\\S]*@author *)(.*) <`],
        ['AUTHOR_EMAIL', `^([\\s\\S]*@author.* <)(.*)>`],
        ['COPYRIGHT_START_YEAR', `^([\\s\\S]*@license *Copyright © )(\\d+)`],
        ['COPYRIGHT_END_YEAR', `^([\\s\\S]*@license *Copyright © \\d+-)(\\d+)`],
        ['COPYRIGHT_COMPANY', `^([\\s\\S]*@license *Copyright © \\d+-\\d+ )(.*)`]
    ]
) ;

// Get specific header template for languageId

const getHeaderTemplate = (languageId: string): string =>
{
    return templateMap.get(languageDelimiters[languageId][0])[0] ;
}

const getFooterTemplate = (languageId: string): string =>
{
    return templateMap.get(languageDelimiters[languageId][0])[1] ;
} ;

// Fit value to correct field width, padded with spaces

const pad = (value: string, width: number): string =>
    value.concat(' '.repeat(width)).substr(0, width) ;

// Stringify Date to correct format for header

const formatDate = (date: moment.Moment): string =>
    date.format('YYYY/MM/DD HH:mm:ss') ;

// Get Date object from date string formatted for header

const parseDate = (date: string): moment.Moment =>
    moment(date, 'YYYY/MM/DD HH:mm:ss') ;

// Check if language is supported

export const supportsLanguage = (languageId: string): boolean =>
    languageId in languageDelimiters ;

// Returns current header text if present at top of document

export const extractHeader = (text: string): string | null =>
{

    const headerRegex: string = `^((?:#{150}\n)(?:.*\n){6}(?:#{150}\n))` ;
    const match: RegExpMatchArray = text.match(headerRegex) ;

    return match ? match[0] : null ;

} ;

export const hasFooter = (text: string): boolean =>
{

    const footerRegex: string = `^((?:#{150}\n)(?:.*\n){6}(?:#{150}\n)[\\s\\S]*(?:#{150}\n*)$)` ;
    const match: RegExpMatchArray = text.match(footerRegex) ;

    return match ? true : false ;

} ;

// Regex to match field in template
// Returns [ global match, offset, field ]

const fieldRegex = (name: string): RegExp =>
    new RegExp(`^((?:.*\\\n)*.*)(\\\$${name}_*)`, '') ;

// Get value for given field name from header string

const getFieldValue = (header: string, name: string): string | undefined =>
{

    const fieldRegex: string | null = headerFieldRegexMap.get(name) ;

    if (!fieldRegex)
    {
        return undefined ;
    }

    const matchResult: RegExpMatchArray = header.match(fieldRegex) ;

    if (matchResult.length != 3)
    {
        return undefined ;
    }

    const [_, offset, field] = matchResult ;

    return header.substr(offset.length, field.length) ;

} ;

// Set field value in header string

const setFieldValue = (header: string, name: string, value: string | number): string =>
{

    const [_, offset, field] = header.match(fieldRegex(name)) ;

    return header.substr(0, offset.length)
        .concat(value.toString())
        .concat(header.substr(offset.length + field.length)) ;

} ;

// Extract header info from header string

export const getHeaderInfo = (header: string): HeaderInfo =>
(
    {
        projectName: getFieldValue(header, 'PROJECT_NAME'),
        filePath: getFieldValue(header, 'FILE_PATH'),
        authorName: getFieldValue(header, 'AUTHOR_NAME'),
        authorEmail: getFieldValue(header, 'AUTHOR_EMAIL'),
        copyrightStartYear: parseInt(getFieldValue(header, 'COPYRIGHT_START_YEAR')),
        copyrightEndYear: parseInt(getFieldValue(header, 'COPYRIGHT_END_YEAR')),
        copyrightCompany: getFieldValue(header, 'COPYRIGHT_COMPANY')
    }
) ;

// Renders a language template with header info

export const renderHeader = (languageId: string, info: HeaderInfo) =>
[
    { name: 'PROJECT_NAME', value: info.projectName },
    { name: 'FILE_PATH', value: info.filePath },
    { name: 'AUTHOR_NAME', value: info.authorName },
    { name: 'AUTHOR_EMAIL', value: info.authorEmail },
    { name: 'COPYRIGHT_START_YEAR', value: info.copyrightStartYear },
    { name: 'COPYRIGHT_END_YEAR', value: info.copyrightEndYear },
    { name: 'COPYRIGHT_COMPANY', value: info.copyrightCompany },
]
.reduce
(
    (header, field) =>
        setFieldValue(header, field.name, field.value),
        getHeaderTemplate(languageId)
) ;

export const renderFooter = (languageId: string) => getFooterTemplate(languageId) ;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
