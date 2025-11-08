
Immutable data provides fundamental guarantees that enable reliable, distributed, and concurrent systems. But immutability clashes with real-world needs like privacy and security. That's why Semantic Flow embraces [[principle.pseudo-immutability]].



- [[mesh-resource.node-component.flow-snapshot.version]] (e.g. in [[folder._vN]]) should be usually be treated as immutable. 
  - Therefore, if you need to refer to a flow "as is", you should refer to its corresponding snapshot version.
  - TODO: examples
- sometimes, e.g., for compliance reasons, you have to modify or hard-delete some data. 


## References

https://s11.no/2013/prov/resources-that-change-state/
