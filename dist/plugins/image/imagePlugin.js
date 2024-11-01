import { ArgumentError } from '../../errors/index.js';
import { MimeTypeHelper } from '../../mimeType.js';
import { XmlNode } from '../../xml/index.js';
import { TemplatePlugin } from '../templatePlugin.js';
let nextImageId = 1;
export class ImagePlugin extends TemplatePlugin {
    contentType = 'image';
    async simpleTagReplacements(tag, data, context) {
        const wordTextNode = this.utilities.docxParser.containingTextNode(tag.xmlTextNode);
        const content = data.getScopeData();
        if (!content || !content.source) {
            XmlNode.remove(wordTextNode);
            return;
        }
        const mediaFilePath = await context.docx.mediaFiles.add(content.source, content.format);
        const relType = MimeTypeHelper.getOfficeRelType(content.format);
        const relId = await context.currentPart.rels.add(mediaFilePath, relType);
        await context.docx.contentTypes.ensureContentType(content.format);
        const imageId = nextImageId++;
        const imageXml = this.createMarkup(imageId, relId, content);
        XmlNode.insertAfter(imageXml, wordTextNode);
        XmlNode.remove(wordTextNode);
    }
    createMarkup(imageId, relId, content) {
        const name = `Picture ${imageId}`;
        const markupText = `
            <w:drawing>
                <wp:inline distT="0" distB="0" distL="0" distR="0">
                    <wp:extent cx="${this.pixelsToEmu(content.width)}" cy="${this.pixelsToEmu(content.height)}"/>
                    <wp:effectExtent l="0" t="0" r="0" b="0"/>
                    ${this.docProperties(imageId, name, content)}
                    <wp:cNvGraphicFramePr>
                        <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/>
                    </wp:cNvGraphicFramePr>
                    <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                            ${this.pictureMarkup(imageId, relId, name, content)}
                        </a:graphicData>
                    </a:graphic>
                </wp:inline>
            </w:drawing>
        `;
        const markupXml = this.utilities.xmlParser.parse(markupText);
        XmlNode.removeEmptyTextNodes(markupXml);
        return markupXml;
    }
    docProperties(imageId, name, content) {
        if (content.altText) {
            return `<wp:docPr id="${imageId}" name="${name}" descr="${content.altText}"/>`;
        }
        return `
            <wp:docPr id="${imageId}" name="${name}">
                <a:extLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
					<a:ext uri="{C183D7F6-B498-43B3-948B-1728B52AA6E4}">
						<adec:decorative xmlns:adec="http://schemas.microsoft.com/office/drawing/2017/decorative" val="1"/>
					</a:ext>
				</a:extLst>
            </wp:docPr>
        `;
    }
    pictureMarkup(imageId, relId, name, content) {
        return `
            <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                <pic:nvPicPr>
                    <pic:cNvPr id="${imageId}" name="${name}"/>
                    <pic:cNvPicPr>
                        <a:picLocks noChangeAspect="1" noChangeArrowheads="1"/>
                    </pic:cNvPicPr>
                </pic:nvPicPr>
                <pic:blipFill>
                    <a:blip r:embed="${relId}">
                        ${this.transparencyMarkup(content.transparencyPercent)}
                        <a:extLst>
                            <a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}">
                                <a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/>
                            </a:ext>
                        </a:extLst>
                    </a:blip>
                    <a:srcRect/>
                    <a:stretch>
                        <a:fillRect/>
                    </a:stretch>
                </pic:blipFill>
                <pic:spPr bwMode="auto">
                    <a:xfrm>
                        <a:off x="0" y="0"/>
                        <a:ext cx="${this.pixelsToEmu(content.width)}" cy="${this.pixelsToEmu(content.height)}"/>
                    </a:xfrm>
                    <a:prstGeom prst="rect">
                        <a:avLst/>
                    </a:prstGeom>
                    <a:noFill/>
                    <a:ln>
                        <a:noFill/>
                    </a:ln>
                </pic:spPr>
            </pic:pic>
        `;
    }
    transparencyMarkup(transparencyPercent) {
        if (transparencyPercent === null || transparencyPercent === undefined) {
            return '';
        }
        if (transparencyPercent < 0 || transparencyPercent > 100) {
            throw new ArgumentError(`Transparency percent must be between 0 and 100, but was ${transparencyPercent}.`);
        }
        const alpha = Math.round((100 - transparencyPercent) * 1000);
        return `<a:alphaModFix amt="${alpha}" />`;
    }
    pixelsToEmu(pixels) {
        return Math.round(pixels * 9525);
    }
}
//# sourceMappingURL=imagePlugin.js.map