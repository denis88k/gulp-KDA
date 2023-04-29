const anyThink = () => {
  const a = { f };
  console.log('ane');
  return { a };
};

anyThink();

const a = document.querySelector('a');
a.addEventListener('click', e => {
  anyThink();
  console.log(e.target.value);
});
a.classList.add('f');

const qwe = 12.432;
qwe.toFixed(2);

const aq = {
  b: 1,
  c: b,
};
