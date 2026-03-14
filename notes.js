    document.addEventListener("DOMContentLoaded",function(){
        const notesContainer=document.getElementById("notesContainer");
        const addNoteModal=document.getElementById("addNoteModal");
        const addNoteBtn=document.getElementById("addNoteBtn");
        const closeModalBtn=document.getElementById("closeModalBtn");
        const noteForm=document.getElementById("noteForm");
        const emptyContainer=document.getElementById("empty-container");
        const confirmModal=document.getElementById("confirmModal");
        const confirmDeleteBtn=document.getElementById("confirmDeleteBtn");
        const cancelDeleteBtn=document.getElementById("cancelDeleteBtn");
        const searchInput=document.getElementById("searchInput");
        const filterSelect=document.getElementById("filterSelect");
        let notes=JSON.parse(localStorage.getItem("notes"))||[];
        let noteToDeleteId=null;
        renderNotes();
        updateEmptyState();
        function openAddNoteModal(){
            addNoteModal.classList.add("active");
            document.body.style.overflow="hidden";
        }
        function closeAddNoteModal(){
            addNoteModal.classList.remove("active");
            document.body.style.overflow="auto";
            noteForm.reset();
        }

        function handleNoteSubmit(e){
            e.preventDefault();
            const title = document.getElementById("noteTitle").value;
            const content=document.getElementById("noteContent").value;
            const tag=document.querySelector('input[name=noteTag]:checked').value;
            const newNote={
                title,
                content,
                tag,
                date: new Date().toISOString(),
            }
            notes.unshift(newNote);
            saveNotes();
            renderNotes();
            closeAddNoteModal();
            updateEmptyState();
        }
            

    function renderNotes(notesToRender=notes){
        notesContainer.innerHTML="";
        notesToRender.forEach((note,index)=>{
            const noteElement=document.createElement('div');
            noteElement.className="fade-in";
            noteElement.innerHTML=`
            <div class="note-content">
            <div class="note-header">
            <h3 class="note-title">
            ${note.title}
            </h3>
            <div class="note-actions">
            <button class="delete-btn" data-id=${index}">
                <i class="fa-solid fa-trash"></i>
            </button>
            </div>
            </div>
            <p class="note-text">${note.content}</p>
            <div class="note-footer">
            <span class="note-tag ${getTagClass(note.tag)}">
                ${getTagIcon(note.tag)} ${getTagName(note.tag)}
            </span>
            <span class="note-date">${formatDate(note.date)}</span>
            </div>
            </div>
            `
            notesContainer.append(noteElement);
        })
        document.querySelectorAll(".delete-btn").forEach(btn=>{
            btn.addEventListener("click",function(){
                noteToDeleteId=this.getAttribute("data-id");
                openConfirmModal();
            });
        });
    }
    
        function getTagClass(tag){
            const classes={
                work:"tag-work",
                personal:"tag-personal",
                ideas:"tag-ideas",
                reminders:"tag-reminders"
            }
            return classes[tag]||"";
        }
        function getTagName(tag){
            const names={
                work:"Work",
                personal:"Personal",
                ideas:"Ideas",
                reminders:"Reminders"
            }
            return names[tag]||"";
        }
        function getTagIcon(tag){
            const icons={
                work:`<i class="fas fa-briefcase"></i>`,
                personal:`<i class="fa-solid fa-user"></i>`,
                ideas:`<i class="fas fa-lightbulb"></i>`,
                reminders:`<i class="fa-solid fa-bell"></i>`,
            }
            return icons[tag]||"";
        }
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        }
        function updateEmptyState(notesToCheck=notes){
            if(notesToCheck.length==0)
                emptyContainer.style.display="block";
            else
                emptyContainer.style.display="none";
        }

        function saveNotes(){
            localStorage.setItem("notes",JSON.stringify(notes));
        }
        function openConfirmModal(){
            confirmModal.classList.add("active");
            document.body.style.overflow="hidden";
        }
        function closeConfirmModal(){
            confirmModal.classList.remove("active");
            document.body.style.overflow="auto";
            noteToDeleteId=null;
        }
    function confirmDeleteNote(){
            if(noteToDeleteId!=null){
                notes.splice(noteToDeleteId,1);
                saveNotes();
                renderNotes();
                updateEmptyState();
                closeConfirmModal();
            }
    }
    
    function filterNotes(){
        const searchTerm=searchInput.value.toLowerCase();
        const filterValue=filterSelect.value;
        let filteredNotes=notes;
        if(searchTerm){
            filteredNotes=filteredNotes.filter((note)=>{
                return note.title.toLowerCase().includes(searchTerm)||
                        note.content.toLowerCase().includes(searchTerm);
            });
        }
        if(filterValue!="all"){
            filteredNotes=filteredNotes.filter((note)=>{
                return note.tag===filterValue;
            })
        }
        renderNotes(filteredNotes);
        updateEmptyState(filteredNotes);
    }
        noteForm.addEventListener("submit",handleNoteSubmit);
        cancelDeleteBtn.addEventListener("click",closeConfirmModal);
        confirmDeleteBtn.addEventListener("click",confirmDeleteNote);
        addNoteBtn.addEventListener("click",openAddNoteModal);
        closeModalBtn.addEventListener("click",closeAddNoteModal);
        searchInput.addEventListener("input",filterNotes);
        filterSelect.addEventListener("change",filterNotes);
    });
