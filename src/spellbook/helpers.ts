export async function patchElement(res: any, template: string, locals: any) {
  const htmlSnippet: any = await new Promise((resolve, reject) => {
    res.render(template, locals, (err: any, html: any) => {
      if (err) reject(err);
      else resolve(html);
    });
  });

  res.write(
    `event: datastar-patch-elements\ndata: elements ${htmlSnippet.replace(/\n/g, "")}\n\n`,
  );
}

export async function patchElementNoTemplate(res: any, html: string) {
  res.write(
    `event: datastar-patch-elements\ndata: elements ${html.replace(/\n/g, "")}\n\n`,
  );
}
