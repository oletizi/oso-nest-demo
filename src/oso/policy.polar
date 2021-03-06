members_only(document: Document) if document.membersOnly;

#### Guest permissions

allow(user: Guest, "read", document: Document) if
    role(user, "guest", document) and
    not members_only(document);

allow(user: Guest, "addDocumentComment", document: Document) if
    role(user, "guest", document) and
    document.allowsDocumentComment;

allow(user: Guest, "addInlineComment", document: Document) if
    role(user, "guest", document) and
    document.allowsInlineComment;

#### User permissions

allow(user: User, "read", document:Document) if
    role(user, "guest", document) and
    not members_only(document);

# allow all authenticated users to create
allow(_user: User, "create", "Document");

# allow all authenticated users to attempt to edit
allow(_user: User, "edit", "Document");


### Member permissions

allow(user: User, "read", document: Document) if
    role(user, "member", document);

allow(user: User, "edit", document: Document) if
    role(user, "member", document);

allow(user: User, "addDocumentComment", document: Document) if
    role(user, "member", document);

allow(user: User, "addInlineComment", document: Document) if
    role(user, "member", document);


### Admin-specific permissions

allow(user: User, "edit", project: Project) if
    role(user, "admin", project);

allow(user: User, "delete", project: Project) if
    role(user, "admin", project)

allow(user: User, "edit", document: Document) if
    role(user, "admin", document)

allow(user: User, "delete", document: Document) if
    role(user, "admin", document);

### Owner permissions

allow(user: User, _, project: Project) if
    role(user, "owner", project);

allow(user: User, _, document: Document) if
    role(user, "owner", document);

### Example of other policies

# All users can delete notes they created
allow(user: User, "delete", note) if
    user.id = note.createdBy;

# But only admins can delete notes generally.
allow(user: User, "delete", note) if
    role(user, "admin", note);


# Test Rules
allow("foo", "read", "bar");
allow(_user:User, "read", "bar");
allow(user:User, "read", document: Document) if
  user.username = "testuser" and document.id = 1;
