import api from './Api';

export function sets() {
  return new Promise((resolve, reject) => {
    api('/api/kyt/user/sets/', 'GET', true)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}

export function categories(id) {
  return new Promise((resolve, reject) => {
    api(`/api/kyt/sets/${id}/categories/answered`, 'GET', true)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}

export function questions(id, page) {
  return new Promise((resolve, reject) => {
    api(`/api/kyt/categories/${id}/questions?page=${page}&per_page=10`, 'GET', true)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}

export function hasAnsweredQuestion(id) {
  return new Promise((resolve, reject) => {
    api(`/api/kyt/categories/${id}/answered`, 'GET', true)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}

export function answerKYT(setID, answer) {
  const body = {
    kyt_set_id: setID,
    kyt_company_questions: answer
  };

  return new Promise((resolve, reject) => {
    api('/api/kyt/questions/answers', 'POST', true, body)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}

export function postQuestion(categoryID, question) {
  const body = {
    kyt_company_category_id: categoryID,
    kyt_company_questions: [question]
  };

  return new Promise((resolve, reject) => {
    api('/api/kyt/questions', 'POST', true, body)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}
