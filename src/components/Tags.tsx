import {PageMetadata} from "./metadata";
import {revenue} from "../revenue";
import NewTagForm from "./NewTagForm";
import {useState} from "react";

interface TagsMetadata extends PageMetadata {

}

export default function Tags({}: TagsMetadata) {
    const [tags, setTags] = useState(revenue.getTags());

    return (
        <div id="page-tags" className="container-fluid show"
             style={{
                 width: "calc(100% - 2rem)"
             }}>
            <div className="row">
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h3>Tags</h3>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h3>Neuer Tag</h3>
                    </div>
                    <NewTagForm onSubmit={(name, income) => {
                        revenue.createTag(name, income);
                        setTags([...revenue.getTags()]);
                    }}/>
                </div>
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h3>Überblick</h3>
                    </div>
                    <div className="d-flex flex-column">
                        <span><strong>Insgesamt:</strong>&nbsp;{revenue.getTags().length}</span>
                        <span><strong>Einkommen:</strong>&nbsp;{revenue.getTags().filter(tag => tag.income).length}</span>
                        <span><strong>Ausgaben:</strong>&nbsp;{revenue.getTags().filter(tag => !tag.income).length}</span>
                    </div>
                </div>
            </div>
            <div className="row">
                {tags.sort((a, b) => a.name > b.name ? 1 : -1).map((tag) => (
                    <div className="col shadow rounded-2 db-card" style={{
                        maxWidth: 300,
                        minWidth: 300
                    }}>
                        <div className="db-card-header">
                            <h6>{tag.income ? "Einnahme" : "Ausgabe"}</h6>
                            <h3>{tag.name}</h3>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary text-light" onClick={() => {
                                revenue.confirm("Möchten Sie den Tag wirklich Löschen und damit alle gebundenen Einträge").then(e => {
                                    if (e) {
                                        revenue.removeTag(tag.id);
                                        setTags(revenue.getTags());
                                    }
                                });
                            }}>
                                Löschen
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}