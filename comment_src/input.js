const $commentContainer = document.querySelector("#comment");
const $form = document.querySelector(".input-container");

let localStorageArray = [];
initPrint();


// 코멘트 한글자라도 있으면 버튼 활성화,댓글 하나라도 있으면 전송버튼 활성화 시켜서 UX로 알려주자 - 전역임
const $commentText = document.querySelector(".comment-text.add-comment");
const $formSubmitBtn = document.querySelector(".form-btn");
$commentText.addEventListener("input",(e)=>{
    $commentText.value.trim() !=='' ? $formSubmitBtn.classList.add("submit") : $formSubmitBtn.classList.remove("submit");
  })





// 실시간으로 감시를 해줘야 할까?
// form의 username과 pwd, text가 빈 문자열과 유효성검사에 합격 하면
//localStorage에 배열의 오브젝트에 저장 후 댓글 추가

// 유효성 검사 빈배열이면 return false 해주기
$form.addEventListener("submit", addCommentFunc);







function initPrint() {
    const datas = getLocalStorageData();
    // localStorage에 머 없으면 우짬? return 해줘야지 멀 징징거려 채문길
    if(datas=== null || datas ===undefined) return
    
    // html에 꽂아버리기
    printingTemplate(datas)
 }


function addCommentFunc(event) {
  event.preventDefault();
    
  const $userName = document.querySelector(".input-name");
  const $userPwd = document.querySelector(".input-pwd");

 
  // 불합격하면 반환
  if (!isValidateInfo($userName, $userPwd, $commentText)) return;
  printingComment($userName,$userPwd,$commentText)
}

function isValidateInfo(name, pwd, text) {
  if (
    name.value !== "" &&
    pwd.value.length == 4 &&
    pwd.value !== "" &&
    !isNaN(pwd.value) &&// pwd.value가 0000 이면 안먹음 =>!!Number(pwd.value) 따라서 !isNaN함수로 대체함
    text.value !== ""
  )return true;
    
  return false;
}

function printingComment(name, pwd, text) {
    $commentContainer.innerHTML = '' 
   const today = commentDate(); 
   const datas = setGetLocalStorage(name,pwd,text,today)

   printingTemplate(datas)
  $form.reset();
}

function commentDate() {
  const today = new Date();
  const notationOptions = {
    month: "long",
    day: "numeric",
  };
  return today.toLocaleDateString("ko-KR", notationOptions);
}

// localStorage에 저장하고 얻어오기 <- form event 때문임;;
function setGetLocalStorage(name,pwd,text,today){
  const info = {
    pwd: pwd.value,
    name : name.value,
    text: text.value,
    date: today,
 }
  localStorageArray.unshift(info);
  const convertJson = JSON.stringify(localStorageArray);
  localStorage.setItem("data",convertJson);

  // globe 변수 localStorageArray를 리턴함
  return getLocalStorageData()
};


// 처음 브라우저 열었을 때 값 받아와서 그려줘야 하니까 getLocalStorageData 함수로 따로 뺌
function getLocalStorageData() {
   const getData = localStorage.getItem("data");
   if(getData === null || getData ===undefined) return

   localStorageArray = JSON.parse(getData)
   return localStorageArray;
}

// 실질적으로 local에서 받아와서 뿌리는 함수임
function printingTemplate(info){
    console.log(info)
    info.forEach((data,i)=>{
        const template = 
        `
        <li class="comment-container" data-id =${i}>
        <div class="comment-view">
          <div class="comment-view-container">
            <div class="comment-info">
              <div class="comment-info_firstName">${data.name[0]}</div>
              <div class="comment-info_fullInfo">
                <span class="fullName">${data.name}</span>
                <div class="comment-date">${data.date}</div>
              </div>
              <div class="comment-func_container">
                <span class="comment-delte_container">
                  <i class="fa-solid fa-trash"></i>
                </span>
                <span class="comment-edit_container">
                  <i class="fa-solid fa-pen"></i>
                </span>
              </div>
            </div>
            <div class="comment-text_container">
              <div class="comment-text">${data.text}</div>
            </div>
          </div>
        </div>
      </li>
        `
        $commentContainer.insertAdjacentHTML("afterbegin", template);
    })
}
