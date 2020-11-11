const container = document.querySelector('.container');
const loading = document.querySelector('.loading');

let latestDoc = null;

const getNextReviews = async () => {
    loading.classList.add('active');
    const ref = db.collection('projects').orderBy('created_at').startAfter(latestDoc || 0).limit(3);
    const data = await ref.get();
    let template = '';
    data.docs.forEach(doc => {
    const project = doc.data();
      template += `
        <div class="card">
          <h2>${project.title}</h2>
          <p>Written by ${project.authorFirstName} ${project.authorLastName} </p>
          <p>${project.content}</p>
        </div>
      `
    });
  container.innerHTML += template;
  loading.classList.remove('active');
  latestDoc = data.docs[data.docs.length - 1];
  if(data.empty){
    loadMore.removeEventListener('click',handleClick);
  }
}

// wait for DOM content to load
window.addEventListener('DOMContentLoaded', () => getNextReviews());


const loadMore = document.querySelector('.load-more button');

const handleClick = ()=>{
    getNextReviews();
}

loadMore.addEventListener('click',handleClick);

const handleScroll = () => {
    let triggerHeight = container.scrollTop + container.offsetHeight;
    if (triggerHeight >= container.scrollHeight) {
      getNextReviews();
    }
}
  
container.addEventListener('scroll', handleScroll);