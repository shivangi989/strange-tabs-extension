document.addEventListener('DOMContentLoaded',async ()=>{
    console.log("Strange Tabs popup script Loaded");
    const tab=await getCurrentTabs();
    displayCurrent(tab);
    await displaySavedSessions();
    const saveSessionBtn=document.querySelector('#saveBtn');
    saveSessionBtn.addEventListener('click',async ()=>{
        const tabsToSave=await getcurrenttabs();
        const sessionName=window.prompt('enter the name of the session');
        if(!sessionName){
            return;
        }
        else{
            const session={
                id:Date.now(),
                title:sessionName,
                createdAt:new Date().toLocaleDateString(),
                tabs:tabsToSave
            }
            await saveSession(session);
            await displaySavedSessions();
        }
    });
});


async function getCurrentTabs(){
    try{
        const tab=await chrome.tabs.query({currentWindow:true,pinned:false});
        console.log(tab);
        return tab;
    }catch(e){
        console.log("Problem fetching the data",e);
    }
}


async function getAllSession(){
    try{
        const sessions=await chrome.storage.local.get(['savedsession']);
        console.log("Data fetching successfull");
        return sessions;
    }
    catch(error){
        console.log("Error occured while getting the data",error);
    }
}

async function saveSession(session){
    try{
        const result=await getAllSession();
        const allSession=result.savedsession||[];
        if(session){
            allSession.push(session);
            await chrome.storage.local.set({savedsession:allSession});
            console.log("your session was saved successfully",allSession);
            alert("Session saved successfully");
        }
        }
    catch(error){
        console.log("Error occured while saving the session",error);
        alert("Error",error);
    }
}

function displayCurrent(tabs){
    const currentList=document.querySelector(".currentTabList");
    currentList.innerHTML="";
    for (const element of tabs)  {
        const currentdiv=document.createElement('div');
        currentdiv.classList.add('tab-item');
        const icon=document.createElement('img');
        icon.classList.add("icon");
        icon.src=element.favIconUrl;
        const tabtitle=document.createElement('span');
        tabtitle.textContent=element.title;
        currentdiv.appendChild(icon);
        currentdiv.appendChild(tabtitle);
        currentList.appendChild(currentdiv);
    }; 
}

async function displaySavedSessions(){
    const sessionList=document.querySelector(".sessionsList");
    sessionList.innerHTML="";
    const result=await getAllSession();
    const session=result.savedsession||[];
    for (const element of session)  {
        const sessiondiv=document.createElement('div');
        sessiondiv.classList.add('session-item');
        sessiondiv.dataset.id=element.id;
        const sessiontitle=document.createElement('span');
        sessiontitle.textContent=element.title;
        sessiondiv.appendChild(sessiontitle);
        sessionList.appendChild(sessiondiv);
    }; 
    console.log("displayed session successfully");
}

