console.log("Loaded via partywown");
/**
 * This operation happens only on the worker and does not percolate to the main thread
 */
performance.mark("longop-start");
for (let i = 0; i < 100000; i++) {
  Math.sinh(Math.acosh(Math.tanh(Math.sqrt(i))));
}
performance.mark("longop-end");
performance.measure("long-op", "longop-start", "longop-end");

/**
 * This operation happens on the main thread.
 */
const id = document.getElementById("viaPartytown");
const node = document.createTextNode(
  `This was created at ${Date()} USING PARTYTOWN`
);
id.appendChild(node);
