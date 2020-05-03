//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// @project        Visual Studio Code Toolbox
/// @file           src/extension.ts
/// @author         Lucas Brémond <lucas.bremond@gmail.com>
/// @license        MIT

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { basename, relative } from 'path' ;
import vscode = require('vscode') ;
import moment = require('moment') ;

import { TextEdit } from 'vscode' ;
import { TextEditorEdit } from 'vscode' ;
import { TextDocument } from 'vscode' ;
import { Position } from 'vscode' ;
import { TextDocumentWillSaveEvent } from 'vscode' ;
import { Range } from 'vscode' ;

import { HeaderInfo } from './header' ;
import { extractHeader } from './header' ;
import { hasFooter } from './header' ;
import { getHeaderInfo } from './header' ;
import { renderHeader } from './header' ;
import { renderFooter } from './header' ;
import { supportsLanguage } from './header' ;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getProjectName = (): string =>
    vscode.workspace.getConfiguration()
        .get('visualStudioCodeToolbox.projectName') || 'My Project' ;

const getAuthorFirstName = (): string =>
    vscode.workspace.getConfiguration()
        .get('visualStudioCodeToolbox.authorFirstName') || 'Sponge' ;

const getAuthorLastName = (): string =>
    vscode.workspace.getConfiguration()
        .get('visualStudioCodeToolbox.authorLastName') || 'Bob' ;

const getAuthorName = (): string => `${getAuthorFirstName()} ${getAuthorLastName()}` ;

const getAuthorEmail = (): string =>
    vscode.workspace.getConfiguration()
        .get('visualStudioCodeToolbox.authorEmail') || `sponge.bob@gmail.com` ;

const getCurrentYear = (): number => moment().year() ;

const getCopyrightStartYear = (): number =>
    vscode.workspace.getConfiguration()
        .get('visualStudioCodeToolbox.copyrightStartYear') || getCurrentYear() ;

const getCopyrightEndYear = (): number =>
    vscode.workspace.getConfiguration()
        .get('visualStudioCodeToolbox.copyrightEndYear') || getCurrentYear() ;

const getCompany = (): string =>
    vscode.workspace.getConfiguration()
        .get('visualStudioCodeToolbox.company') || 'My Company Inc.' ;

const getCurrentFilePath  = (document: TextDocument): string =>
{

    // TBM rootPath is deprecated, use vscode.workspace.workspaceFolders[0].uri.fsPath instead

    const { rootPath } = vscode.workspace ;

    return (rootPath && !document.isUntitled) ? relative(rootPath, document.fileName) : basename(document.fileName) ;

} ;

// Update HeaderInfo with last update author and date, and update filename
// Returns a fresh new HeaderInfo if none was passed

const generateHeaderInfo = (document: TextDocument, headerInfo?: HeaderInfo): HeaderInfo =>
{

    const generatedHeaderInfo: HeaderInfo = Object.assign
    (
        {},
        {
            projectName: getProjectName(),
            authorName: getAuthorName(),
            authorEmail: getAuthorEmail(),
            copyrightStartYear: getCopyrightStartYear(),
            copyrightEndYear: getCopyrightEndYear(),
            copyrightCompany: getCompany()
        },
        headerInfo,
        {
            filePath: getCurrentFilePath(document),
            copyrightEndYear: getCopyrightEndYear()
        }
    ) ;

    return generatedHeaderInfo ;

} ;

const insertHeader = (document: TextDocument, editor: TextEditorEdit): void =>
{

    editor.insert
    (
        new Position(0, 0),
        renderHeader(document.languageId, generateHeaderInfo(document))
    ) ;

} ;

const insertFooter = (document: TextDocument, editor: TextEditorEdit): void =>
{

    editor.insert
    (
        new Position(document.lineCount, 0),
        renderFooter(document.languageId)
    ) ;

} ;

const updateHeader = (currentHeader: string, document: TextDocument, editor: TextEditorEdit): void =>
{

    const renderedHeader: string = renderHeader
    (
        document.languageId,
        generateHeaderInfo(document, getHeaderInfo(currentHeader))
    ) ;

    const headerLineCount: number = renderedHeader.split('\n').length ;

    editor.replace
    (
        new Range(0, 0, (headerLineCount > 1) ? (headerLineCount - 1) : 0, 0),
        renderedHeader
    ) ;

} ;

const manageHeaderAndFooter = (document: TextDocument, editor: TextEditorEdit): void =>
{

    try
    {

        const currentHeader: string | null = extractHeader(document.getText()) ;

        if (currentHeader)
        {

            updateHeader(currentHeader, document, editor) ;

            if (!hasFooter(document.getText()))
            {
                insertFooter(document, editor) ;
            }

        }
        else
        {
            insertHeader(document, editor) ;
            insertFooter(document, editor) ;
        }

    }
    catch (anException)
    {
        vscode.window.showErrorMessage(`Error caught while updating header: [${anException}].`) ;
    }

} ;

// `insertHeader` Command Handler

const insertHeaderAndFooterHandler = (): void =>
{

    const { activeTextEditor } = vscode.window ;
    const { document } = activeTextEditor ;

    if (supportsLanguage(document.languageId))
    {

        activeTextEditor.edit
        (
            (editor: TextEditorEdit): void => manageHeaderAndFooter(document, editor)
        ) ;

    }
    else
    {
        vscode.window.showInformationMessage(`The language [${document.languageId}] is not supported.`) ;
    }

}

// Start watcher for document save to update current header

const startUpdateOnSaveWatcher = (subscriptions: vscode.Disposable[]): void =>
{

    vscode.workspace.onWillSaveTextDocument
    (
        (event: TextDocumentWillSaveEvent): void =>
        {

            const document: TextDocument = event.document ;

            if (supportsLanguage(document.languageId))
            {

                const currentHeader: string | null = extractHeader(document.getText()) ;

                if (currentHeader)
                {

                    const updatedHeader: string = renderHeader(document.languageId, generateHeaderInfo(document, getHeaderInfo(currentHeader))).slice(0, -1) ;

                    const actions =
                    [
                        TextEdit.replace
                        (
                            new Range(0, 0, 8, 0),
                            updatedHeader
                        )
                    ] ;

                    // if (!hasFooter(document.getText()))
                    // {

                    //     actions.push
                    //     (
                    //         TextEdit.insert
                    //         (
                    //             new Position(document.lineCount, 0),
                    //             renderFooter(document.languageId)
                    //         )
                    //     ) ;

                    // }

                    event.waitUntil
                    (
                        Promise.resolve(actions)
                    ) ;

                }

            }

        },
        null,
        subscriptions
    ) ;

}

export const activate = (context: vscode.ExtensionContext): void =>
{

    const disposable = vscode.commands
        .registerTextEditorCommand('visualStudioCodeToolbox.insertHeaderAndFooter', insertHeaderAndFooterHandler) ;

    context.subscriptions.push(disposable) ;

    startUpdateOnSaveWatcher(context.subscriptions) ;

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
